import { TModel } from "../lib/trands/models/TModel";
import { ITrandTagProperties } from "./ITrandTagProperties";

export interface IViewTrandProps {
  TrandProp: ITrandTagProperties;
  model: TModel;
  width: number;
  height: number;
  deep: number;
}