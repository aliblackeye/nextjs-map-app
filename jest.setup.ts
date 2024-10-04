import "@testing-library/jest-dom";

// jest.setup.js
import { TextEncoder } from "util";

global.TextEncoder = TextEncoder;
