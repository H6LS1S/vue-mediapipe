<template>
  <canvas ref="canvas"></canvas>
  <div id="backgrounds">
    <div id="clear"></div>
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

export interface ResponseI {
  id: number;
  title: string;
}

@Options({})
export default class App extends Vue {
  public background = document.createElement("video");
  public source = document.createElement("video");
  public backgrounds: string[] = [];
  public $refs!: {
    canvas: HTMLCanvasElement;
  };

  public coreInit(): Promise<void> {
    return new CoreService(
      this.$refs.canvas,
      this.source,
      this.background
    ).setOptions({
      selfieMode: true,
      modelSelection: 1,
    });
  }

  public backgroundsInit(): Promise<void> {
    return fetch(
      "https://partner-production.eezy.cloud/api/v1/search?term=abstract&per_page=25&page=1&type=video"
    )
      .then((res) => res.json())
      .then<ResponseI[]>(({ data }) => data)
      .then((data) => {
        this.backgrounds = data.map(
          ({ id, title }) =>
            `https://media.istockphoto.com/videos/${title
              .toLowerCase()
              .replace(/\s/g, "-")}-id${id}`
        );
      });
  }

  public async mounted(): Promise<void> {
    this.background.crossOrigin = "Anonymous";
    this.background.autoplay = true;
    this.background.loop = true;

    await Promise.all([this.coreInit(), this.backgroundsInit()]);
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
  width: 70vw;
  display: block;
  overflow: auto;
}
video,
#clear {
  width: 16vw;
  height: 9vw;
  margin: 1vh 1vw;
  display: inline-block;
}
canvas {
  width: 43vw;
  margin: 5vh auto;
  display: block;
  object-fit: contain;
}
</style>
