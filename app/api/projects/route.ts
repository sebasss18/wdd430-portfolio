import { NextRequest, NextResponse } from "next/server";
import { projects } from "../../../lib/projects-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const filteredProjects = type
    ? projects.filter((project) => project.type === type)
    : projects;

  return NextResponse.json(filteredProjects);
}
