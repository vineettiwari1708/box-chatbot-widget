(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const s = document.getElementById("livechat-widget-script");
    if (!s) return;

    const position = s.getAttribute("data-position") || "right";

    // Widget container
    const w = document.createElement("div");
    w.style.cssText = `
      position: fixed;
      bottom: 90px;
      ${position}: 20px;
      width: 300px;
      height: 400px;
      display: none;
      flex-direction: column;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 10px 
