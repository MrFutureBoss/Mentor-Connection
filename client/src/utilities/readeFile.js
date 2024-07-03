import * as XLSX from "xlsx/xlsx.mjs";

const readeFile = (event, setFile) => {
  const file = event.currentTarget.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet);
    setFile(excelData);
  };
  reader.readAsArrayBuffer(new Blob([file]));
};

export default readeFile;
