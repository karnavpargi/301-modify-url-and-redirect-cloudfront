
const redirectMappings = {
    "/contact": "/contact-us",
    "/cookie-policy": "cookie-policy",
    "/privacy-policy": "privacy",
    "/about": "about-us",
    "/team": "about/team",
    "/user-profile": "my-account",
    //... And More 
  };

export const handler = async (event, context, callback) => {
  try {
    const request = event.Records[0].cf.request;
    const oldUri = request.uri;

    // if different URI findout then move to updated link.
    if (redirectMappings[oldUri]) {
    const response = {
        status: "301",
        statusDescription: "Moved Permanently",
        headers: {
          location: [
            {
              key: "Location",
              value: redirectMappings[oldUri],
            },
          ],
           "cache-control": [
             {
               key: "Cache-Control",
               value: "max-age=3600",
             },
           ],
        },
      };
      return callback(null, response); 
    }
    // Else continue with same uri
   callback(null, request);
  } catch (err) {
    console.error(err);
    callback(err);
  }
};
