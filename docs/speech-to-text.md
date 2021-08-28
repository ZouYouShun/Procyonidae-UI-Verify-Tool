1. setting
   1. set google cloud `service_account` file
   2. read setting file into, and save that in
   3. https://stackoverflow.com/questions/38067298/saving-files-locally-with-electron
   4. app.getAppPath()

# FFprobe 教學

https://www.ffmpeg.org/ffprobe.html
https://zwindr.blogspot.com/2016/08/tool-ffprobe.html


> ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4


https://einverne.github.io/post/2015/02/ffprobe-show-media-info.html


```shell
ffprobe -show_streams -show_entries format=bit_rate,filename,start_time:stream=duration,width,height,display_aspect_ratio,r_frame_rate,bit_rate -of json -v quiet -i 98a74a06741a091b8a42aaa31b4edc66.mp4

```

https://github.com/ffmpegwasm/ffmpeg.wasm#installation

# need add that in dev server

<!-- node_modules/@nrwl/react/plugins/webpack.js -->
config.devServer.headers['Cross-Origin-Embedder-Policy']='require-corp';
config.devServer.headers['Cross-Origin-Opener-Policy']='same-origin';
