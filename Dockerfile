FROM oven/bun

WORKDIR //app

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install

RUN yarn tsc
RUN sass --style=compressed ./static/stylesheets/style.scss ./static/stylesheets/style.css

CMD [ "node", "dist/index.js" ]