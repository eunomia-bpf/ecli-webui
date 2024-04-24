import { DefaultApi } from "@/api-client";
import axios from "axios";
import axiosInstance from "./axios";
import { axiosBaseURL } from "./axios";

export const ecliApi = new DefaultApi(
	{
		basePath: axiosBaseURL,
		isJsonMime: () => false,
	},
	undefined,
	axiosInstance,
);
