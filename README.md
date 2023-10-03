### Expectations
In this repo you'll see an attempt to create a Stremio like application but implemented only using Web APIs 

### Files to pay attention
1. [_index.tsx](/app/routes/_index.tsx)
2. [sse.torrent.tsx](/app/routes/sse.torrent.ts)
3. [magnet.ts](/app/utils/magnet.ts)
3. [torrent.ts](/app/utils/torrent.ts)

### Instructions

#### Run the demo
- Run the the `npm run dev` command and inspect your console, you'll see helpful messages there. Up until now the decoding of the peers works sometimes so you have to refresh the page until the binary is correctly parsed

#### Run the test
- Run the the `npm run test` command to see all the current available tests for the different utils in the repository