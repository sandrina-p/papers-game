import { css } from '@emotion/core';
import * as Theme from 'Theme.js';

export const container = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.6rem 1.6rem 5rem; // confirm the bottom of iphoneX
  height: 100vh;
  overflow: hidden;
`;

export const body = css`
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const logo = css`
  font-size: 8rem;
`;

export const paragraph = css`
  text-align: center;
  margin: 0.8rem auto;
`;

export const step = css`
  margin-top: 10vh;
  display: block;
  text-align: center;
  height: 100%;
`;

export const input = css`
  border: none;
  border-bottom: 1px solid ${Theme.colors.grayLight};
  border-radius: 0;
  width: 100%;
  text-align: center;
  ${Theme.typography.h1}
  margin-top: 4rem;

  &:focus {
    outline: none;
    border-color: ${Theme.colors.primaryLight};
  }
`;

export const avatarPlace = css`
  width: 80vw;
  height: 80vw;
  max-width: 30rem;
  max-height: 30rem;
  border-radius: 50%;
  background-color: ${Theme.colors.primaryLight};
  color: ${Theme.colors.primary};
  margin: 2.4rem auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  svg {
    stroke: ${Theme.colors.primary};
    display: inline-block;
    margin-bottom: 1.6rem;
  }
`;

export const avatarImg = css`
  ${avatarPlace}
  border: none;
  object-fit: cover;
`;

export const memeContainer = css`
  position: relative;
  margin-bottom: 1rem;
`;

export const memeFace = css`
  ${avatarImg}
  background: ${Theme.colors.grayDark};
  margin: -0.6rem 0;
  width: 7rem;
  height: 7rem;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

export const memeBody = css`
  width: 20rem;
  height: 20rem;
  fill: ${Theme.colors.grayDark};
`;

export const btnBack = css`
  text-align: left;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ctas = css`
  & > button:not(:last-child),
  & > a:not(:last-child) {
    margin-right: 1.6rem;
    margin-bottom: 1.6rem;
  }
`;

export const reconnect = css`
  border-bottom: 1px solid ${Theme.colors.grayLight};
  padding-bottom: 1.6rem;
  margin-bottom: 1.6rem;
`;