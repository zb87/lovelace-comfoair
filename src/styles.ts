import { css, unsafeCSS } from "lit";
import heatSvg from "./assets/heat.svg";
import bypassSvg from "./assets/bypass.svg";

const heatBg = unsafeCSS(heatSvg);
const bypassBg = unsafeCSS(bypassSvg);

export const cardStyles = css`
  .container {
    padding: 10px;
  }
  .bg-heat {
    background-image: url("${heatBg}");
    height: 200px;
    background-size: 100% 75%;
    background-repeat: no-repeat;
    background-position-y: 45%;
  }
  .bg-bypass {
    background-image: url("${bypassBg}");
    height: 200px;
    background-size: 100% 75%;
    background-repeat: no-repeat;
    background-position-y: 45%;
  }
  .flex-container {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }
  .flex-col-main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    flex-basis: 0;
    text-align: center;
    padding: 30px 0px;
  }
  .flex-col-out {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    flex-basis: 0;
    text-align: left;
  }
  .flex-col-in {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    flex-basis: 0;
    text-align: right;
  }
  .fan-state {
    padding-top: 15px;
  }
  .inactive {
    opacity: 0.5;
  }
  .warning {
    color: #d80707db;
  }
`;
