import express from 'express';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Returns filtered image
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const query = req.query;
    if (!query || !query['image_url']) {
      return res.status(400).send("try GET /filteredimage?image_url={{}}");
    }

    const imageUrl = query['image_url'];

    try {
      const validUrl = new URL(imageUrl);
    } catch(err) {
      return res.status(400).send("Provided image_url is not valid http");
    }

    const result = await filterImageFromURL(imageUrl);

    return res.status(200).sendFile(result);
  });

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();