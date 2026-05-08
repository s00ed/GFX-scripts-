#target illustrator

(function () {
    if (app.documents.length === 0) {
        alert("Open an Illustrator document first.");
        return;
    }

    var doc = app.activeDocument;

    if (!ensureCMYKDocument()) {
        return;
    }

    var PREVIEW_LAYER = "RM_PREVIEW_DO_NOT_PRINT";
    var FINAL_LAYER = "REGISTRATION MARKS";

    var win = new Window("dialog", "Minimal RM Tool V3");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 12;

    var row1 = win.add("group");
    row1.orientation = "row";
    row1.alignChildren = ["left", "center"];

    row1.add("statictext", undefined, "Work:");
    var workDrop = row1.add("dropdownlist", undefined, ["Decal Sheet", "Clothes Film"]);
    workDrop.selection = 0;
    workDrop.preferredSize.width = 135;

    row1.add("statictext", undefined, "Scope:");
    var scopeDrop = row1.add("dropdownlist", undefined, [
        "Active Artboard",
        "Selection Artboard",
        "All Artboards"
    ]);
    scopeDrop.selection = 0;
    scopeDrop.preferredSize.width = 135;

    row1.add("statictext", undefined, "Count:");
    var countDrop = row1.add("dropdownlist", undefined, ["4", "6"]);
    countDrop.selection = 0;
    countDrop.preferredSize.width = 55;

    var row2 = win.add("group");
    row2.orientation = "row";
    row2.alignChildren = ["left", "center"];

    row2.add("statictext", undefined, "Shape:");
    var shapeDrop = row2.add("dropdownlist", undefined, [
        "Target",
        "Bullseye",
        "Cross",
        "Crosshair Gap",
        "Box Cross",
        "Dot",
        "Corner L",
        "Cross R",
        "Corner R"
    ]);
    shapeDrop.selection = 1;
    shapeDrop.preferredSize.width = 160;

    row2.add("statictext", undefined, "Size mm:");
    var sizeInput = row2.add("edittext", undefined, "7");
    sizeInput.characters = 5;

    row2.add("statictext", undefined, "Offset mm:");
    var offsetInput = row2.add("edittext", undefined, "6.5");
    offsetInput.characters = 5;

    var row3 = win.add("group");
    row3.orientation = "row";
    row3.alignChildren = ["left", "center"];

    row3.add("statictext", undefined, "Stroke pt:");
    var strokeInput = row3.add("edittext", undefined, "1.1");
    strokeInput.characters = 5;

    row3.add("statictext", undefined, "Clothes margin mm:");
    var marginInput = row3.add("edittext", undefined, "5");
    marginInput.characters = 5;
    marginInput.enabled = false;

    var row4 = win.add("group");
    row4.orientation = "row";
    row4.alignChildren = ["left", "center"];

    var bleedCheck = row4.add("checkbox", undefined, "Add Bleed Guide");
    bleedCheck.value = true;

    row4.add("statictext", undefined, "Reduce cm:");
    var bleedReduceInput = row4.add("edittext", undefined, "2");
    bleedReduceInput.characters = 5;

    var lockFinalLayerCheck = row4.add("checkbox", undefined, "Lock REGISTRATION MARKS after Apply");
    lockFinalLayerCheck.value = true;

    var cbPanel = win.add("panel", undefined, "Color Bar");
    cbPanel.orientation = "column";
    cbPanel.alignChildren = ["fill", "top"];
    cbPanel.margins = 10;

    var cbRow1 = cbPanel.add("group");
    cbRow1.orientation = "row";
    cbRow1.alignChildren = ["left", "center"];

    var colorBarCheck = cbRow1.add("checkbox", undefined, "Add Color Bar");
    colorBarCheck.value = true;

    cbRow1.add("statictext", undefined, "Direction:");
    var cbDirectionDrop = cbRow1.add("dropdownlist", undefined, ["Horizontal", "Vertical"]);
    cbDirectionDrop.selection = 0;
    cbDirectionDrop.preferredSize.width = 100;

    cbRow1.add("statictext", undefined, "Labels:");
    var cbLabelDrop = cbRow1.add("dropdownlist", undefined, ["Below", "Above", "None"]);
    cbLabelDrop.selection = 0;
    cbLabelDrop.preferredSize.width = 85;

    var cbRow2 = cbPanel.add("group");
    cbRow2.orientation = "row";
    cbRow2.alignChildren = ["left", "center"];

    cbRow2.add("statictext", undefined, "Patch W mm:");
    var cbPatchWInput = cbRow2.add("edittext", undefined, "7");
    cbPatchWInput.characters = 5;

    cbRow2.add("statictext", undefined, "Patch H mm:");
    var cbPatchHInput = cbRow2.add("edittext", undefined, "7");
    cbPatchHInput.characters = 5;

    cbRow2.add("statictext", undefined, "Gap mm:");
    var cbGapInput = cbRow2.add("edittext", undefined, "1.5");
    cbGapInput.characters = 5;

    cbRow2.add("statictext", undefined, "Font:");
    var cbFontInput = cbRow2.add("edittext", undefined, "7");
    cbFontInput.characters = 5;

    var btns = win.add("group");
    btns.orientation = "row";
    btns.alignment = ["right", "center"];

    var previewBtn = btns.add("button", undefined, "Preview");
    var clearBtn = btns.add("button", undefined, "Clear");
    var applyBtn = btns.add("button", undefined, "Apply");
    var closeBtn = btns.add("button", undefined, "Close");

    workDrop.onChange = function () {
        if (workDrop.selection.index === 0) {
            scopeDrop.selection = 0;
            countDrop.selection = 0;
            shapeDrop.selection = 1;
            sizeInput.text = "7";
            offsetInput.text = "6.5";
            strokeInput.text = "1.1";
            marginInput.text = "5";
            marginInput.enabled = false;
            bleedCheck.value = true;
            bleedReduceInput.text = "2";
            lockFinalLayerCheck.value = true;

            colorBarCheck.value = true;
            cbDirectionDrop.selection = 0;
            cbLabelDrop.selection = 0;
            cbPatchWInput.text = "7";
            cbPatchHInput.text = "7";
            cbGapInput.text = "1.5";
            cbFontInput.text = "7";
        } else {
            scopeDrop.selection = 1;
            countDrop.selection = 1;
            shapeDrop.selection = 1;
            sizeInput.text = "7";
            offsetInput.text = "6.5";
            strokeInput.text = "1.1";
            marginInput.text = "5";
            marginInput.enabled = true;
            bleedCheck.value = true;
            bleedReduceInput.text = "2";
            lockFinalLayerCheck.value = true;

            colorBarCheck.value = true;
            cbDirectionDrop.selection = 0;
            cbLabelDrop.selection = 0;
            cbPatchWInput.text = "7";
            cbPatchHInput.text = "7";
            cbGapInput.text = "1.5";
            cbFontInput.text = "7";
        }
    };

    shapeDrop.onChange = function () {
        if (shapeDrop.selection && shapeDrop.selection.text === "Corner R") {
            sizeInput.text = "7";
            strokeInput.text = "0.65";
            offsetInput.text = "6.5";
        }

        if (shapeDrop.selection && shapeDrop.selection.text === "Cross R") {
            sizeInput.text = "7";
            strokeInput.text = "0.75";
            offsetInput.text = "6.5";
        }
    };

    previewBtn.onClick = function () {
        clearLayer(PREVIEW_LAYER);
        createRM(true);
    };

    clearBtn.onClick = function () {
        clearLayer(PREVIEW_LAYER);
        app.redraw();
    };

    applyBtn.onClick = function () {
        clearLayer(PREVIEW_LAYER);
        clearLayer(FINAL_LAYER);
        createRM(false);
    };

    closeBtn.onClick = function () {
        clearLayer(PREVIEW_LAYER);
        win.close();
    };

    win.center();
    win.show();

    function createRM(isPreview) {
        if (!ensureCMYKDocument()) {
            return;
        }

        var isDecal = workDrop.selection.index === 0;
        var count = parseInt(countDrop.selection.text, 10);

        var sizeMM = num(sizeInput.text, 7);
        var offsetMM = num(offsetInput.text, 6.5);
        var strokePT = num(strokeInput.text, 1.1);
        var marginMM = num(marginInput.text, 5);
        var bleedReduceCM = num(bleedReduceInput.text, 2);

        if (sizeMM <= 0) sizeMM = 7;
        if (offsetMM < 0) offsetMM = 0;
        if (strokePT <= 0) strokePT = 1.1;
        if (marginMM < 0) marginMM = 0;
        if (bleedReduceCM < 0) bleedReduceCM = 0;

        var size = mm(sizeMM);
        var offset = mm(offsetMM);
        var margin = mm(marginMM);

        var selectionBounds = getSelectionBounds();
        var targets = getTargetArtboardIndexes(isDecal, selectionBounds);

        if (targets.length === 0) {
            alert("No valid artboard target found.");
            return;
        }

        if (!isDecal && !selectionBounds) {
            alert("Clothes Film mode needs selected artwork.");
            return;
        }

        var layerName = isPreview ? PREVIEW_LAYER : FINAL_LAYER;
        var layer = getCleanLayer(layerName);

        layer.locked = false;
        layer.visible = true;

        try {
            if (isPreview) {
                layer.printable = false;
            }
        } catch (ePrint) {}

        doc.activeLayer = layer;

        var regColor = registrationColor();
        var totalMarks = 0;

        for (var t = 0; t < targets.length; t++) {
            var abIndex = targets[t];
            var artBounds = getArtboardBoundsByIndex(abIndex);
            var baseBounds = isDecal ? artBounds : selectionBounds;

            var positions = isDecal
                ? decalPositions(baseBounds, size, offset, count)
                : clothesPositions(baseBounds, size, offset, count);

            var markBounds = null;
            var bottomLeftMarkBounds = null;

            for (var i = 0; i < positions.length; i++) {
                var groupName = buildRMName(abIndex, i + 1, positions[i].pos);

                createOneGroupedMark(
                    layer,
                    groupName,
                    positions[i].x,
                    positions[i].y,
                    positions[i].pos,
                    size,
                    strokePT,
                    regColor,
                    shapeDrop.selection.text
                );

                var b = {
                    left: positions[i].x - size / 2,
                    top: positions[i].y + size / 2,
                    right: positions[i].x + size / 2,
                    bottom: positions[i].y - size / 2
                };

                markBounds = unionBounds(markBounds, b);

                if (positions[i].pos === "bottom-left") {
                    bottomLeftMarkBounds = b;
                }

                totalMarks++;
            }

            if (!isPreview && !isDecal) {
                fitArtboardByIndex(abIndex, unionBounds(baseBounds, markBounds), margin);
            }

            if (bleedCheck.value) {
                createBleedGuide(layer, abIndex, strokePT, regColor, bleedReduceCM);
            }

            if (colorBarCheck.value) {
                createColorBarV3(layer, abIndex, regColor, bottomLeftMarkBounds);
            }
        }

        doc.selection = null;

        if (!isPreview && lockFinalLayerCheck.value) {
            try {
                layer.locked = true;
            } catch (eLock) {}
        }

        app.redraw();

        if (!isPreview) {
            alert(
                "Done.\n\n" +
                "Target artboards: " + targets.length + "\n" +
                "Registration marks: " + totalMarks + " grouped marks\n" +
                "Bleed Guide: " + (bleedCheck.value ? "Added" : "Off") + "\n" +
                "Color Bar: " + (colorBarCheck.value ? "Added" : "Off") + "\n" +
                "Layer locked: " + (lockFinalLayerCheck.value ? "Yes" : "No") + "\n" +
                "Document mode: CMYK"
            );
        }
    }

    function getTargetArtboardIndexes(isDecal, selectionBounds) {
        var result = [];

        if (isDecal) {
            if (scopeDrop.selection.index === 2) {
                for (var i = 0; i < doc.artboards.length; i++) {
                    result.push(i);
                }
                return result;
            }

            if (scopeDrop.selection.index === 1 && selectionBounds) {
                result.push(findBestArtboardForBounds(selectionBounds));
                return result;
            }

            result.push(doc.artboards.getActiveArtboardIndex());
            return result;
        }

        if (selectionBounds) {
            result.push(findBestArtboardForBounds(selectionBounds));
        } else {
            result.push(doc.artboards.getActiveArtboardIndex());
        }

        return result;
    }

    function findBestArtboardForBounds(b) {
        var bestIndex = doc.artboards.getActiveArtboardIndex();
        var bestArea = -1;

        for (var i = 0; i < doc.artboards.length; i++) {
            var ab = getArtboardBoundsByIndex(i);
            var area = intersectionArea(b, ab);

            if (area > bestArea) {
                bestArea = area;
                bestIndex = i;
            }
        }

        if (bestArea > 0) {
            return bestIndex;
        }

        var cx = (b.left + b.right) / 2;
        var cy = (b.top + b.bottom) / 2;

        for (var j = 0; j < doc.artboards.length; j++) {
            var ab2 = getArtboardBoundsByIndex(j);

            if (cx >= ab2.left && cx <= ab2.right && cy <= ab2.top && cy >= ab2.bottom) {
                return j;
            }
        }

        return bestIndex;
    }

    function intersectionArea(a, b) {
        var left = Math.max(a.left, b.left);
        var right = Math.min(a.right, b.right);
        var top = Math.min(a.top, b.top);
        var bottom = Math.max(a.bottom, b.bottom);

        var w = right - left;
        var h = top - bottom;

        if (w <= 0 || h <= 0) {
            return 0;
        }

        return w * h;
    }

    function createOneGroupedMark(layer, groupName, x, y, pos, size, strokePT, color, shape) {
        var parts = [];

        drawShapeParts(parts, layer, x, y, pos, size, strokePT, color, shape);

        if (parts.length === 0) {
            return;
        }

        var group = layer.groupItems.add();
        group.name = groupName;

        for (var i = 0; i < parts.length; i++) {
            try {
                parts[i].move(group, ElementPlacement.PLACEATEND);
            } catch (eMove) {}
        }

        try {
            group.move(layer, ElementPlacement.PLACEATEND);
        } catch (eGroupMove) {}
    }

    function createBleedGuide(layer, abIndex, strokePT, color, reduceCM) {
        var ab = getArtboardBoundsByIndex(abIndex);

        var artW = ab.right - ab.left;
        var artH = ab.top - ab.bottom;

        var reducePT = cm(reduceCM);

        var guideW = artW - reducePT;
        var guideH = artH - reducePT;

        if (guideW <= 0 || guideH <= 0) {
            alert("Bleed Guide is too small on artboard " + (abIndex + 1) + ".");
            return;
        }

        var centerX = (ab.left + ab.right) / 2;
        var centerY = (ab.top + ab.bottom) / 2;

        var left = centerX - guideW / 2;
        var top = centerY + guideH / 2;

        var rect = layer.pathItems.rectangle(top, left, guideW, guideH);

        rect.name = "AB" + pad2(abIndex + 1) + "_BLEED_GUIDE";
        rect.filled = false;
        rect.stroked = true;
        rect.strokeWidth = strokePT;
        rect.strokeColor = color;

        try {
            rect.guides = true;
        } catch (eGuide) {
            alert("Could not convert bleed rectangle to guide on artboard " + (abIndex + 1) + ".");
        }

        try {
            rect.selected = false;
        } catch (eSel) {}
    }

    function createColorBarV3(layer, abIndex, regColor, avoidBounds) {
        var ab = getArtboardBoundsByIndex(abIndex);

        var values = [0,10,20,30,40,50,60,70,80,90,100];

        var isVertical = cbDirectionDrop.selection.text === "Vertical";
        var labelMode = cbLabelDrop.selection.text;

        var patchW = mm(num(cbPatchWInput.text, 7));
        var patchH = mm(num(cbPatchHInput.text, 7));
        var gap = mm(num(cbGapInput.text, 1.5));
        var fontSize = num(cbFontInput.text, 7);

        if (patchW <= 0) patchW = mm(7);
        if (patchH <= 0) patchH = mm(7);
        if (gap < 0) gap = mm(1.5);
        if (fontSize <= 0) fontSize = 7;

        var insetLeft = mm(6);
        var insetBottom = mm(6);
        var awayGap = mm(10);
        var labelGap = mm(3.2);

        var startX = ab.left + insetLeft;
        var bottomY = ab.bottom + insetBottom;

        var totalW = isVertical ? patchW : (values.length * patchW) + ((values.length - 1) * gap);
        var totalH = isVertical ? (values.length * patchH) + ((values.length - 1) * gap) : patchH;

        if (avoidBounds) {
            startX = Math.max(startX, avoidBounds.right + awayGap);
        }

        var predicted = colorBarBounds(startX, bottomY, totalW, totalH, labelMode, isVertical, fontSize, labelGap);

        if (avoidBounds && boundsOverlap(predicted, avoidBounds)) {
            startX = avoidBounds.right + awayGap;
            predicted = colorBarBounds(startX, bottomY, totalW, totalH, labelMode, isVertical, fontSize, labelGap);
        }

        if (predicted.right > ab.right - mm(4)) {
            startX = ab.left + mm(6);

            if (avoidBounds) {
                bottomY = avoidBounds.top + awayGap;
            }

            predicted = colorBarBounds(startX, bottomY, totalW, totalH, labelMode, isVertical, fontSize, labelGap);
        }

        if (predicted.bottom < ab.bottom + mm(4)) {
            bottomY += (ab.bottom + mm(4)) - predicted.bottom;
            predicted = colorBarBounds(startX, bottomY, totalW, totalH, labelMode, isVertical, fontSize, labelGap);
        }

        if (predicted.top > ab.top - mm(4)) {
            bottomY -= predicted.top - (ab.top - mm(4));
            if (bottomY < ab.bottom + mm(4)) bottomY = ab.bottom + mm(4);
        }

        var group = layer.groupItems.add();
        group.name = "AB" + pad2(abIndex + 1) + "_COLOR_BAR";

        for (var i = 0; i < values.length; i++) {
            var x;
            var yTop;

            if (isVertical) {
                x = startX;
                yTop = bottomY + ((i + 1) * patchH) + (i * gap);
            } else {
                x = startX + i * (patchW + gap);
                yTop = bottomY + patchH;
            }

            var rect = layer.pathItems.rectangle(yTop, x, patchW, patchH);
            rect.name = "COLOR_BAR_PATCH_" + String(values[i]);
            rect.filled = true;
            rect.stroked = true;
            rect.strokeWidth = 0.5;
            rect.strokeColor = regColor;
            rect.fillColor = registrationTint(values[i]);

            try {
                rect.move(group, ElementPlacement.PLACEATEND);
            } catch (eMoveRect) {}

            if (labelMode !== "None") {
                var tf = layer.textFrames.add();
                tf.contents = String(values[i]);
                tf.name = "COLOR_BAR_LABEL_" + String(values[i]);

                if (isVertical) {
                    tf.position = [x + patchW + mm(1.5), yTop - patchH * 0.25];
                } else {
                    if (labelMode === "Above") {
                        tf.position = [x + patchW * 0.15, yTop + labelGap + fontSize];
                    } else {
                        tf.position = [x + patchW * 0.15, bottomY - labelGap];
                    }
                }

                try {
                    tf.textRange.characterAttributes.size = fontSize;
                    tf.textRange.characterAttributes.fillColor = regColor;
                    setEnglishFont(tf);
                } catch (eTxt) {}

                try {
                    tf.move(group, ElementPlacement.PLACEATEND);
                } catch (eMoveTxt) {}
            }
        }

        try {
            group.move(layer, ElementPlacement.PLACEATEND);
        } catch (eGroupMove) {}
    }

    function colorBarBounds(x, yBottom, totalW, totalH, labelMode, isVertical, fontSize, labelGap) {
        var b = {
            left: x,
            right: x + totalW,
            bottom: yBottom,
            top: yBottom + totalH
        };

        if (labelMode !== "None") {
            if (!isVertical) {
                if (labelMode === "Below") {
                    b.bottom = b.bottom - labelGap - fontSize;
                } else {
                    b.top = b.top + labelGap + fontSize;
                }
            } else {
                b.right = b.right + mm(12);
            }
        }

        return b;
    }

    function boundsOverlap(a, b) {
        if (!a || !b) return false;

        return !(
            a.right < b.left ||
            a.left > b.right ||
            a.top < b.bottom ||
            a.bottom > b.top
        );
    }

    function drawShapeParts(parts, layer, x, y, pos, size, strokePT, color, shape) {
        if (shape === "Target") {
            parts.push(circle(layer, x, y, size, strokePT, color, false));
            cross(parts, layer, x, y, size, strokePT, color);

        } else if (shape === "Bullseye") {
            parts.push(circle(layer, x, y, size, strokePT, color, false));
            parts.push(circle(layer, x, y, size * 0.55, strokePT, color, false));
            parts.push(circle(layer, x, y, size * 0.18, strokePT, color, true));
            cross(parts, layer, x, y, size, strokePT, color);

        } else if (shape === "Cross") {
            cross(parts, layer, x, y, size, strokePT, color);

        } else if (shape === "Crosshair Gap") {
            crossGap(parts, layer, x, y, size, strokePT, color);
            parts.push(circle(layer, x, y, size, strokePT, color, false));

        } else if (shape === "Box Cross") {
            parts.push(square(layer, x, y, size, strokePT, color));
            parts.push(circle(layer, x, y, size * 0.45, strokePT, color, false));
            cross(parts, layer, x, y, size, strokePT, color);

        } else if (shape === "Dot") {
            parts.push(circle(layer, x, y, size * 0.42, strokePT, color, true));

        } else if (shape === "Corner L") {
            cornerL(parts, layer, x, y, pos, size, strokePT, color);

        } else if (shape === "Cross R") {
            crossR(parts, layer, x, y, size, strokePT, color);

        } else if (shape === "Corner R") {
            cornerR(parts, layer, x, y, pos, size, strokePT, color);
        }
    }

    function cross(parts, layer, x, y, size, strokePT, color) {
        var h = size / 2;
        parts.push(line(layer, x - h, y, x + h, y, strokePT, color));
        parts.push(line(layer, x, y - h, x, y + h, strokePT, color));
    }

    function crossGap(parts, layer, x, y, size, strokePT, color) {
        var h = size / 2;
        var gap = size * 0.14;

        parts.push(line(layer, x - h, y, x - gap, y, strokePT, color));
        parts.push(line(layer, x + gap, y, x + h, y, strokePT, color));
        parts.push(line(layer, x, y - h, x, y - gap, strokePT, color));
        parts.push(line(layer, x, y + gap, x, y + h, strokePT, color));
    }

    function cornerL(parts, layer, x, y, pos, size, strokePT, color) {
        var dx = 1;
        var dy = -1;

        if (pos.indexOf("right") >= 0) dx = -1;
        if (pos.indexOf("bottom") >= 0) dy = 1;

        if (pos === "top-center") {
            parts.push(line(layer, x - size / 2, y, x + size / 2, y, strokePT, color));
            return;
        }

        if (pos === "bottom-center") {
            parts.push(line(layer, x - size / 2, y, x + size / 2, y, strokePT, color));
            return;
        }

        parts.push(line(layer, x, y, x + dx * size, y, strokePT, color));
        parts.push(line(layer, x, y, x, y + dy * size, strokePT, color));
    }

    function crossR(parts, layer, x, y, size, strokePT, color) {
        crossRDirectional(parts, layer, x, y, size, strokePT, color, 1, -1);
    }

    function crossRDirectional(parts, layer, x, y, size, strokePT, color, dirX, dirY) {
        var crossHalf = size * 0.42;
        var vHalf = size * 0.60;
        var innerStroke = Math.max(0.25, strokePT * 0.65);

        parts.push(line(layer, x, y - vHalf, x, y + vHalf, innerStroke, color));
        parts.push(line(layer, x - crossHalf, y, x + crossHalf, y, innerStroke, color));

        var tf = layer.textFrames.add();
        tf.contents = "R";
        tf.name = "RM_part_R";

        try {
            tf.textRange.characterAttributes.size = size * 0.58;
            tf.textRange.characterAttributes.fillColor = color;
            setEnglishFont(tf);
        } catch (eStyle) {}

        var rCenterX = x + dirX * size * 0.38;
        var rCenterY = y + dirY * size * 0.38;

        centerItemOnPoint(tf, rCenterX, rCenterY);

        parts.push(tf);
    }

    function cornerR(parts, layer, x, y, pos, size, strokePT, color) {
        if (pos === "top-center" || pos === "bottom-center") {
            parts.push(line(layer, x - size * 0.55, y, x + size * 0.55, y, strokePT, color));
            return;
        }

        if (pos === "left-center" || pos === "right-center") {
            parts.push(line(layer, x, y - size * 0.55, x, y + size * 0.55, strokePT, color));
            return;
        }

        var dirX = 1;
        var dirY = -1;

        if (pos.indexOf("right") >= 0) dirX = -1;
        if (pos.indexOf("bottom") >= 0) dirY = 1;

        var arm = size * 0.90;

        parts.push(line(layer, x, y, x + dirX * arm, y, strokePT, color));
        parts.push(line(layer, x, y, x, y + dirY * arm, strokePT, color));

        var innerX = x + dirX * size * 0.34;
        var innerY = y + dirY * size * 0.34;
        var innerSize = size * 0.42;

        crossRDirectional(parts, layer, innerX, innerY, innerSize, strokePT, color, dirX, dirY);
    }

    function centerItemOnPoint(item, cx, cy) {
        try {
            var b = item.visibleBounds;
            var itemCX = (b[0] + b[2]) / 2;
            var itemCY = (b[1] + b[3]) / 2;

            item.translate(cx - itemCX, cy - itemCY);
        } catch (e) {
            try {
                item.position = [cx, cy];
            } catch (e2) {}
        }
    }

    function line(layer, x1, y1, x2, y2, strokePT, color) {
        var p = layer.pathItems.add();
        p.setEntirePath([[x1, y1], [x2, y2]]);
        p.filled = false;
        p.stroked = true;
        p.strokeWidth = strokePT;
        p.strokeColor = color;
        p.name = "RM_part";

        try {
            p.strokeCap = StrokeCap.BUTTENDCAP;
        } catch (eCap) {}

        return p;
    }

    function circle(layer, x, y, diameter, strokePT, color, filled) {
        var r = diameter / 2;
        var c = layer.pathItems.ellipse(y + r, x - r, diameter, diameter);

        c.filled = filled;
        c.stroked = !filled;

        if (filled) {
            c.fillColor = color;
        } else {
            c.strokeWidth = strokePT;
            c.strokeColor = color;
        }

        c.name = "RM_part";
        return c;
    }

    function square(layer, x, y, size, strokePT, color) {
        var h = size / 2;
        var s = layer.pathItems.rectangle(y + h, x - h, size, size);

        s.filled = false;
        s.stroked = true;
        s.strokeWidth = strokePT;
        s.strokeColor = color;
        s.name = "RM_part";
        return s;
    }

    function decalPositions(b, size, offset, count) {
        var h = size / 2;

        var left = b.left + offset + h;
        var right = b.right - offset - h;
        var top = b.top - offset - h;
        var bottom = b.bottom + offset + h;
        var midX = (b.left + b.right) / 2;

        var arr = [
            { x: left, y: top, pos: "top-left" },
            { x: right, y: top, pos: "top-right" },
            { x: left, y: bottom, pos: "bottom-left" },
            { x: right, y: bottom, pos: "bottom-right" }
        ];

        if (count === 6) {
            arr.push(
                { x: midX, y: top, pos: "top-center" },
                { x: midX, y: bottom, pos: "bottom-center" }
            );
        }

        return arr;
    }

    function clothesPositions(b, size, offset, count) {
        var h = size / 2;

        var left = b.left - offset - h;
        var right = b.right + offset + h;
        var top = b.top + offset + h;
        var bottom = b.bottom - offset - h;
        var midX = (b.left + b.right) / 2;

        var arr = [
            { x: left, y: top, pos: "top-left" },
            { x: right, y: top, pos: "top-right" },
            { x: left, y: bottom, pos: "bottom-left" },
            { x: right, y: bottom, pos: "bottom-right" }
        ];

        if (count === 6) {
            arr.push(
                { x: midX, y: top, pos: "top-center" },
                { x: midX, y: bottom, pos: "bottom-center" }
            );
        }

        return arr;
    }

    function buildRMName(abIndex, index, pos) {
        return "AB" + pad2(abIndex + 1) + "_RM_" + pad2(index) + "_" + pos;
    }

    function getArtboardBoundsByIndex(index) {
        var ab = doc.artboards[index].artboardRect;

        return {
            left: ab[0],
            top: ab[1],
            right: ab[2],
            bottom: ab[3]
        };
    }

    function getSelectionBounds() {
        if (!doc.selection || doc.selection.length === 0) {
            return null;
        }

        var b = null;

        for (var i = 0; i < doc.selection.length; i++) {
            try {
                var item = doc.selection[i];

                if (!item || item.typename === "Layer") continue;

                var vb = item.visibleBounds;

                b = unionBounds(b, {
                    left: vb[0],
                    top: vb[1],
                    right: vb[2],
                    bottom: vb[3]
                });
            } catch (e) {}
        }

        return b;
    }

    function fitArtboardByIndex(index, b, margin) {
        if (!b) return;

        doc.artboards[index].artboardRect = [
            b.left - margin,
            b.top + margin,
            b.right + margin,
            b.bottom - margin
        ];
    }

    function unionBounds(a, b) {
        if (!a) return b;
        if (!b) return a;

        return {
            left: Math.min(a.left, b.left),
            top: Math.max(a.top, b.top),
            right: Math.max(a.right, b.right),
            bottom: Math.min(a.bottom, b.bottom)
        };
    }

    function registrationColor() {
        try {
            return new RegistrationColor();
        } catch (e1) {}

        try {
            return doc.swatches.getByName("[Registration]").color;
        } catch (e2) {}

        try {
            return doc.swatches.getByName("Registration").color;
        } catch (e3) {}

        return registrationProcess100();
    }

    function registrationTint(tintValue) {
        try {
            var sw = doc.swatches.getByName("[Registration]");

            if (sw.color.typename === "SpotColor") {
                var sc = new SpotColor();
                sc.spot = sw.color.spot;
                sc.tint = tintValue;
                return sc;
            }
        } catch (e1) {}

        return registrationProcessTint(tintValue);
    }

    function registrationProcess100() {
        var c = new CMYKColor();
        c.cyan = 100;
        c.magenta = 100;
        c.yellow = 100;
        c.black = 100;
        return c;
    }

    function registrationProcessTint(k) {
        var c = new CMYKColor();
        c.cyan = k;
        c.magenta = k;
        c.yellow = k;
        c.black = k;
        return c;
    }

    function setEnglishFont(tf) {
        try {
            tf.textRange.characterAttributes.textFont = app.textFonts.getByName("ArialMT");
        } catch (e1) {
            try {
                tf.textRange.characterAttributes.textFont = app.textFonts.getByName("MyriadPro-Regular");
            } catch (e2) {
                try {
                    tf.textRange.characterAttributes.textFont = app.textFonts.getByName("Helvetica");
                } catch (e3) {}
            }
        }

        try {
            tf.textRange.characterAttributes.language = LanguageType.ENGLISHUSA;
        } catch (e4) {}
    }

    function getCleanLayer(name) {
        var layer;

        try {
            layer = doc.layers.getByName(name);
            layer.locked = false;
            layer.visible = true;
        } catch (e) {
            layer = doc.layers.add();
            layer.name = name;
        }

        var safety = 0;

        while (layer.pageItems.length > 0 && safety < 10000) {
            safety++;

            try {
                layer.pageItems[0].locked = false;
            } catch (eLock) {}

            try {
                layer.pageItems[0].guides = false;
            } catch (eGuide) {}

            try {
                layer.pageItems[0].remove();
            } catch (eRemove) {
                break;
            }
        }

        return layer;
    }

    function clearLayer(name) {
        try {
            var layer = doc.layers.getByName(name);
            layer.locked = false;
            layer.visible = true;

            var safety = 0;

            while (layer.pageItems.length > 0 && safety < 10000) {
                safety++;

                try {
                    layer.pageItems[0].locked = false;
                } catch (eLock) {}

                try {
                    layer.pageItems[0].guides = false;
                } catch (eGuide) {}

                try {
                    layer.pageItems[0].remove();
                } catch (eRemove) {
                    break;
                }
            }

            layer.remove();

        } catch (e) {}
    }

    function ensureCMYKDocument() {
        try {
            doc = app.activeDocument;

            if (doc.documentColorSpace === DocumentColorSpace.CMYK) {
                return true;
            }

            var savedSelection = [];
            var oldInteraction = app.userInteractionLevel;

            try {
                if (doc.selection && doc.selection.length > 0) {
                    for (var i = 0; i < doc.selection.length; i++) {
                        savedSelection.push(doc.selection[i]);
                    }
                }
            } catch (eSel) {}

            app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

            try {
                app.executeMenuCommand("doc-color-cmyk");
                doc = app.activeDocument;
            } catch (eCmd) {
                app.userInteractionLevel = oldInteraction;
                alert(
                    "Could not convert document to CMYK automatically.\n\n" +
                    "Please use:\nFile > Document Color Mode > CMYK Color"
                );
                return false;
            }

            app.userInteractionLevel = oldInteraction;

            try {
                doc.selection = null;

                for (var s = 0; s < savedSelection.length; s++) {
                    savedSelection[s].selected = true;
                }
            } catch (eRestore) {}

            if (doc.documentColorSpace !== DocumentColorSpace.CMYK) {
                alert(
                    "Document is still not CMYK.\n\n" +
                    "Please convert manually:\nFile > Document Color Mode > CMYK Color"
                );
                return false;
            }

            return true;

        } catch (err) {
            try {
                app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
            } catch (e) {}

            alert(
                "CMYK check/conversion failed.\n\n" +
                "Please convert manually:\nFile > Document Color Mode > CMYK Color"
            );

            return false;
        }
    }

    function pad2(n) {
        n = parseInt(n, 10);
        return n < 10 ? "0" + n : String(n);
    }

    function num(value, fallback) {
        var n = parseFloat(value);
        return isNaN(n) ? fallback : n;
    }

    function mm(value) {
        return value * 2.834645669;
    }

    function cm(value) {
        return value * 28.34645669;
    }

})();
