import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiDefaultResponses(summary = 'Success') {
  return applyDecorators(
    ApiResponse({ status: 200, description: `${summary}` }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}
