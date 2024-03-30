import React from "react";

class HItAndTry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64String: "",
    };
  }

  // Function to convert PDF file to Base64 string
  pdfToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Event triggered when file reading is successfully completed
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract Base64 string from data URL
        resolve(base64String);
      };

      // Event triggered if an error occurs while reading the file
      reader.onerror = () => {
        reject(reader.error);
      };

      // Read the PDF file as a Data URL
      reader.readAsDataURL(file);
    });
  };

  handleFileChange = async (event) => {
    const file = event.target.files[0];

    try {
      const base64String = await this.pdfToBase64(file);
      this.setState({ base64String });
      console.log(base64String); // Base64 string of the PDF file
    } catch (error) {
      console.error("Error converting PDF to Base64:", error);
    }
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <div>Base64 String: {this.state.base64String}</div>
      </div>
    );
  }
}

export default HItAndTry;
