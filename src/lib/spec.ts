/** Fired by the configurator's "Send this spec" button; the contact form listens. */
export const SPEC_EVENT = "bizcraft:spec";
export type SpecDetail = { product: string; quantity: string; message: string };
