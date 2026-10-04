const potrace = require('potrace');
const fs = require('fs');

const imagePath = 'C:/Users/Windows/.gemini/antigravity/brain/f9ce727a-d72f-4eed-b74f-a74a18fc1dc1/.user_uploaded/media_1791034623887.png';
const params = {
    color: '#F16F24', // Saffron color
    background: 'transparent',
    optTolerance: 0.2,
    turdSize: 100,
    turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY
};

potrace.trace(imagePath, params, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync('e:/MnM_Travel_Russian/images/mnmlogo.svg', svg);
  console.log('SVG generated at images/mnmlogo.svg');
});
