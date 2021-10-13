import { Camera } from "@mediapipe/camera_utils";
import {
  Options,
  Results,
  SelfieSegmentation,
} from "@mediapipe/selfie_segmentation";

export class CoreService extends Camera {
  private readonly pipe = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  constructor(
    public readonly canvas: HTMLCanvasElement,
    public readonly source: HTMLVideoElement,
    public readonly background: HTMLVideoElement,
    public readonly ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  ) {
    super(source, {
      onFrame: async () => await this.pipe.send({ image: source }),
    });

    source.addEventListener("loadedmetadata", () => {
      this.canvas.height = source.videoHeight;
      this.canvas.width = source.videoWidth;
    });
  }

  /**
   *
   * @param options {@link https://google.github.io/mediapipe/solutions/pose.html#javascript-solution-api|Mediapipe}
   */
  public setOptions(options: Options): Promise<void> {
    this.pipe.onResults((results) => this.render(results));
    this.pipe.setOptions(options);
    return this.start();
  }

  public render({ segmentationMask, image }: Results): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Only overwrite existing pixels.
    if (this.background.src) {
      if (segmentationMask)
        this.ctx.drawImage(segmentationMask, 0, 0, width, height);

      const ratio =
        (this.canvas.height / this.background.videoHeight) *
        this.background.videoWidth;

      this.ctx.globalCompositeOperation = "source-out";
      this.ctx.drawImage(
        this.background,
        -(ratio - width) / 2,
        0,
        ratio,
        height
      );
    }

    // Only overwrite missing pixels.
    this.ctx.globalCompositeOperation = "destination-atop";
    this.ctx.drawImage(image, 0, 0, width, height);
  }
}
