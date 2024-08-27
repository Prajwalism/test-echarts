import pako from "pako";

export function decompressArray(binary) {
  try {
    const binaryString = atob(binary);

    // Convert binary string to Uint8Array
    const charCodeArray = binaryString
      .split("")
      .map((char) => char.charCodeAt(0));
    const uint8Array = new Uint8Array(charCodeArray);

    // Decompress the Uint8Array
    const decompressedData = pako.ungzip(uint8Array, { to: "string" });

    // Parse the decompressed string as JSON
    const jsonDataReceived = JSON.parse(decompressedData);

    return jsonDataReceived;
  } catch (error) {
    console.error("Error decompressing data:", error);
    return null;
  }
}
