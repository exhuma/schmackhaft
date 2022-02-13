import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('schmackhaft')
class Schmackhaft extends LitElement {
    override render() {
        return "Hello World!";
    }
}
