import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useEffect, useState } from 'react';

const ffmpeg = createFFmpeg({
  corePath: './@ffmpeg/ffmpeg-core.js',
});

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File>();
  const [gif, setGif] = useState<string>();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video!));

    // Run the FFMpeg command
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );
    setGif(url);
  };

  useEffect(() => {
    load();
  }, []);

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="250">
          <source src={URL.createObjectURL(video)} type="video/mp4" />
          Your browser does not support HTML video.
        </video>
      )}

      <input
        type="file"
        onChange={(e) => {
          const item = e.target.files?.item(0);
          if (item) {
            setVideo(item);
          }
        }}
      />

      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>

      {gif && <img src={gif} width="250" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
