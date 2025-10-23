export type BaseErrorType = {
  message: string;
  code: string;
  data?: Record<string, string | number | boolean | null | undefined>;
  extra?: Record<string, any>;
};
