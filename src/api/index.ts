import { options } from './options'

import youtubeSearch from "youtube-search";

youtubeSearch('test', options, (err, results) => {
    if(err) return console.log(err);

    console.dir(results);
});

