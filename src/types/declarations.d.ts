declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.sql?raw" {
    const content: string;
    export default content;
}
