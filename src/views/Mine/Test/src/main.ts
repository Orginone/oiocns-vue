import initSdk from ".";

const a = initSdk("appId");

a.connectParent().then(() => {
  console.log("连接完成");
  a.listen("dataChange", (data) => {
    console.log("dataChange", data);
  });
});

// const aBtns = document.querySelectorAll("button");

// aBtns[0].onclick = () => {
//   console.log("按钮1");
//   window.top.postMessage("aaa", "http://127.0.0.1:8000/");
// };
