# Eco_Travel

여행 일정 공유 시스템

## 개발환경

Window 8.1

Node.js version 10.17.0

React version 16.8.3

Expo version 33.0.0

ngrok version 2.3.35

## 설치방법

git clone으로 모든 데이터를 다운받는다.

### Windows

node.js 10.x 설치 (https://nodejs.org/ko/download/releases/)

node.js 후 cmd를 열고

```
npm install expo-cli --global
npm install  -g ngrok

```
expo-cli와 ngrok를 설치한다.

backend로 디렉토리를 이동

```
npm start

```
로 서버를 구동한다.

```
ngrok http 3000

```
으로 서버를 http 포트번호 3000으로 터널링한다

이후 frontend로 디렉토리를 이동 후
```
expo start

```