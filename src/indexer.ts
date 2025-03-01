import * as fs from "node:fs";
import * as ts from "typescript";
import path from "node:path";
import { Index } from "./config";

export function populateIndex(index: Index) {
  if (!fs.existsSync(index.dir)) {
    console.error(`Directory not found: ${index.dir}`);
    return index;
  }

  const files = fs.readdirSync(index.dir).map((file) => ({
    relativePath: `./${path.relative(index.dir, path.join(index.dir, file))}`,
    source: path.join(index.dir, file),
    exports: getFileExports(path.join(index.dir, file)),
  }));

  return { ...index, files };
}

function getFileExports(src: string) {
  const contents = fs.readFileSync(src, "utf-8");
  const file = ts.createSourceFile(src, contents, ts.ScriptTarget.ESNext);
  const fileExports: Record<
    string,
    | ts.TypeAliasDeclaration
    | ts.InterfaceDeclaration
    | ts.ClassDeclaration
    | ts.FunctionDeclaration
    | ts.VariableStatement
    | ts.ExportAssignment
  > = {};

  function isExportable(child: ts.HasModifiers) {
    return !!child.modifiers?.find(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
  }

  file.forEachChild((child: ts.Node) => {
    if (child.kind === ts.SyntaxKind.EndOfFileToken) return;

    if (ts.isTypeAliasDeclaration(child) && isExportable(child)) {
      if (child.name) {
        fileExports[child.name.getText(file)] = child;
      }
      return;
    }

    if (ts.isInterfaceDeclaration(child) && isExportable(child)) {
      if (child.name) {
        fileExports[child.name.getText(file)] = child;
      }
      return;
    }

    if (ts.isClassDeclaration(child) && isExportable(child)) {
      if (child.name) {
        fileExports[child.name.getText(file)] = child;
      }
      return;
    }

    if (ts.isFunctionDeclaration(child) && isExportable(child)) {
      if (child.name) {
        fileExports[child.name.getText(file)] = child;
      }
      return;
    }

    if (ts.isStatement(child) && isExportable(child as ts.VariableStatement)) {
      if (ts.isVariableStatement(child)) {
        const [declaration] = child.declarationList.declarations;
        if (declaration && declaration.name) {
          fileExports[declaration.name.getText(file)] = child;
        }
      }
      return;
    }

    if (ts.isExportAssignment(child)) {
      if (!child.isExportEquals) {
        fileExports["default"] = child;
      }
    }
  });

  return fileExports;
}
