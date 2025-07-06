import _Color from 'color';

class Color {
  instance: _Color;

  constructor(color: string) {
    this.instance = _Color(color);
  }

  negate(): string {
    return this.instance.negate().string();
  }

  lighten(val: number): string {
    return this.instance.lighten(val).string();
  }

  darken(val: number): string {
    return this.instance.darken(val).string();
  }

  saturate(val: number): string {
    return this.instance.saturate(val).string();
  }

  desaturate(val: number): string {
    return this.instance.desaturate(val).string();
  }

  grayscale(): string {
    return this.instance.grayscale().string();
  }

  whiten(val: number): string {
    return this.instance.whiten(val).string();
  }

  blacken(val: number): string {
    return this.instance.blacken(val).string();
  }

  fade(val: number): string {
    return this.instance.fade(val).string();
  }

  opaquer(val: number): string {
    return this.instance.opaquer(val).string();
  }

  rotate(val: number): string {
    return this.instance.rotate(val).string();
  }

  mix(color: string, ratio?: number): string {
    return this.instance.mix(_Color(color), ratio).string();
  }

  lighter(val: number): string {
    const lightness = Number(this.instance.hsl().object().l) + val;
    return this.instance.lightness(lightness).string();
  }

  darker(val: number): string {
    const lightness = Number(this.instance.hsl().object().l) - val;
    return this.instance.lightness(lightness).string();
  }
}

const colorInstance = (color: string): Color => new Color(color);

export default colorInstance;
