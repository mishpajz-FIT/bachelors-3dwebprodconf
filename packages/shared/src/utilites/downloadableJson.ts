export const downloadableJson = (json: string, fileName: string) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${fileName}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
