FROM node:16

WORKDIR /app

ENV DATABASE_URL=postgresql://postgres:clinacare@clinaDatabase:5432/clina-challenge?connect_timeout=300
ENV JWT_SECRET=clinaCareChallenge

COPY package.json .

RUN npm install

COPY . ./

RUN npm run-script build

CMD ["npm", "run-script", "start"]
