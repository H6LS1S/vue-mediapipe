<template>
  <canvas ref="canvas"></canvas>
  <div id="backgrounds">
    <div id="clear" @click="background.removeAttribute('src')">X</div>
    <input
      id="file"
      type="file"
      accept="video/mp4,video/x-m4v,video/*"
      style="display: none"
      @change="onUploadBackground"
    />

    <label class="file-input" for="file">
      <figure>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="17"
          viewBox="0 0 20 17"
        >
          <path
            d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
          ></path>
        </svg>
      </figure>
    </label>

    <br />

    <video
      v-for="(src, index) in backgrounds"
      :key="index"
      :src="src"
      @click="background.src = src"
    ></video>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { CoreService } from "./services";

@Options({})
export default class App extends Vue {
  public background = document.createElement("video");
  public source = document.createElement("video");
  public backgrounds: string[] = Array.from(new Array(7), (_, i: number) =>
    require(`@/assets/background_${i + 1}.mp4`)
  );

  public $refs!: {
    canvas: HTMLCanvasElement;
  };

  public onUploadBackground(event: any): void {
    this.background.src = URL.createObjectURL(event.target.files[0]);
  }

  public async mounted(): Promise<void> {
    this.background.crossOrigin = "Anonymous";
    this.background.autoplay = true;
    this.background.loop = true;

    await new CoreService(
      this.$refs.canvas,
      this.source,
      this.background
    ).setOptions({
      selfieMode: true,
      modelSelection: 1,
    });
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
  background: rgb(225, 225, 225);
}

#app {
  height: 100vh;
  display: flex;
  justify-content: space-around;
}

#backgrounds {
  width: 60vw;
  display: block;
  overflow: auto;
}
video,
#clear,
.file-input {
  width: 16vw;
  height: 9vw;
  margin: 1vh 1vw;
  line-height: 9vw;
  text-align: center;
  display: inline-block;
  color: aliceblue;
  fill: aliceblue;
  background: rgba(0, 0, 0, 0.5);
}
canvas {
  width: 40vw;
  margin: 1vh 3vw;
  display: block;
  object-fit: contain;
}
</style>
