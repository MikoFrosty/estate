const ImageKit = require("imagekit");

exports.handler = async function(event, context) {
  const imagekit = new ImageKit({
    publicKey: "public_1ymwqbS+ZFU+iWlHlVXrNmoW6FA=",
    privateKey: "private_ZbdrHLQhN3IcrNT8Jlgjg2kXYKU=",
    urlEndpoint: "https://ik.imagekit.io/deqylxaey/"
  });

  const result = imagekit.getAuthenticationParameters();
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
