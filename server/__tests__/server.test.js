const request = require("supertest")
const express = require("express")
import { describe, test, expect } from "vitest"

const app = express()
app.get("/", (req, res) => res.send("Hello World!"))
