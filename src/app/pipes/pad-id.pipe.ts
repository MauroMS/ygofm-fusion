import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "padId",
  pure: true,
})
export class PadIdPipe implements PipeTransform {
  transform(value: number | string, length = 3): string {
    const str = typeof value === "number" ? value.toString() : value;
    return str.padStart(length, "0");
  }
}
