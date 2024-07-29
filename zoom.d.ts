import { RPC2Request, RPC2Response } from "./rpc2.d.ts";

export interface ResponseZoomParams {
  status: {
    Status: "Autofocus" | "Normal";
    Zoom: number;
    Focus: number;
    AutofocusPeak: 0;
    FocusMotorSteps: number;
    ZoomMotorSteps: number;
  };
}

export interface RequestZoomParams {
  focus: number;
  zoom: number;
}

type AdjustFocusRequest = RPC2Request<RequestZoomParams>;
type AdjustFocusResponse = RPC2Response<null>;

// tem um "object": 2 no request mas nem vamos usar isso