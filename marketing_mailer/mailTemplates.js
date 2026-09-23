const htmlTemplates = (content) => 
`
<html>
<body>
${content}
</body>
</html>
`

export const welcomeMail = () => {
  const content = `<h1>Welcome to Inn Box!</h1>`;
  return htmlTemplates(content);
}

export const confirmationMail = (url) => {
  const content = `<a href="${url}"><h1>Confrim your email</h1></a>`;
  return htmlTemplates(content);
}

export const campaignMail = (campaignText, campaignKey, email) => {
  const content = `
  <h1>${campaignText}</h1>
  <img src="http://localhost:3000/campaign/${campaignKey}/user/${email}/image.png" style="display:none">
  `;
  return htmlTemplates(content);
}