/**
 * SpotColorKeyOrder_TEXT_GROUP_BOTTOM_FAST.jsx
 * ─────────────────────────────────────────────
 * Reads used Spot Colors on ACTIVE ARTBOARD only.
 *
 * Output:
 * - Text color key.
 * - Fast create.
 * - Final result is GROUPED.
 * - Final group is placed at bottom left or bottom right of active artboard.
 *
 * IMPORTANT:
 * - No Illustrator Align commands.
 * - No visibleBounds per text item.
 * - No redraw inside loops.
 * - Final group only uses one bounds calculation.
 */

#target illustrator
#targetengine main

(function () {

    if (!app.documents.length) {
        alert("Open a document first.");
        return;
    }

    var DOC = app.activeDocument;

    var CFG = {
        layerName: "Color Key",

        alignDefault: true,
        overprintDefault: true,

        fontSize: 42,
        lineGap: 8,

        useArabicDigitsInOutput: true,

        offsetFromArtboardLeft: 80,
        offsetFromArtboardTop: 120,

        ignoreOutputLayer: true,
        clearOldOutput: true,

        bottomMargin: 60,
        sideMargin: 60,

        // Text baseline visual correction.
        // لو النص طالع أو نازل سنة عدل الرقم ده:
        // 0.30 / 0.35 / 0.40
        baselineOffsetFactor: 0.35,

        // true = faster, does not scan every text character
        fastTextScan: true
    };

    var ORIGINAL_SELECTION = [];

    try {
        if (DOC.selection && DOC.selection.length) {
            for (var os = 0; os < DOC.selection.length; os++) {
                ORIGINAL_SELECTION.push(DOC.selection[os]);
            }
        }
    } catch (eSelCopy) {}

    // =========================================================
    // ACTIVE ARTBOARD
    // =========================================================

    function getActiveAB() {
        return DOC.artboards[DOC.artboards.getActiveArtboardIndex()].artboardRect;
        // [left, top, right, bottom]
    }

    function overlaps(b, ab) {
        return !(b[2] < ab[0] || b[0] > ab[2] || b[3] > ab[1] || b[1] < ab[3]);
    }

    function getCenter(bounds) {
        return {
            x: (bounds[0] + bounds[2]) / 2,
            y: (bounds[1] + bounds[3]) / 2
        };
    }

    function getReferenceCenter() {
        if (ORIGINAL_SELECTION && ORIGINAL_SELECTION.length > 0) {
            try {
                return getCenter(ORIGINAL_SELECTION[0].visibleBounds);
            } catch (e1) {
                try {
                    return getCenter(ORIGINAL_SELECTION[0].geometricBounds);
                } catch (e2) {}
            }
        }

        var ab = getActiveAB();

        return {
            x: (ab[0] + ab[2]) / 2,
            y: (ab[1] + ab[3]) / 2
        };
    }

    // =========================================================
    // COLLECT USED SPOT COLORS - ACTIVE ARTBOARD ONLY
    // =========================================================

    function collectUsedSpots() {
        var ab = getActiveAB();
        var seen = {};
        var result = [];

        var layers = DOC.layers;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            try {
                if (!layer.visible || layer.locked) continue;
            } catch (e0) {}

            try {
                if (CFG.ignoreOutputLayer && layer.name === CFG.layerName) continue;
            } catch (e1) {}

            try {
                walkItemsFast(layer.pageItems, ab, seen, result);
            } catch (e2) {}
        }

        return result;
    }

    function walkItemsFast(items, ab, seen, result) {
        for (var i = 0; i < items.length; i++) {
            var it = items[i];

            try {
                if (it.hidden || it.locked) continue;
            } catch (e0) {}

            try {
                if (CFG.ignoreOutputLayer && it.layer && it.layer.name === CFG.layerName) {
                    continue;
                }
            } catch (eLayer) {}

            try {
                if (!overlaps(it.geometricBounds, ab)) continue;
            } catch (e1) {}

            try {
                switch (it.typename) {
                    case "GroupItem":
                        walkItemsFast(it.pageItems, ab, seen, result);
                        break;

                    case "CompoundPathItem":
                        walkItemsFast(it.pathItems, ab, seen, result);
                        break;

                    case "TextFrame":
                        collectFromTextFast(it, seen, result);
                        break;

                    default:
                        collectFromObject(it, seen, result);
                        break;
                }
            } catch (e2) {}
        }
    }

    function collectFromObject(it, seen, result) {
        try {
            pushColor(it.fillColor, seen, result);
        } catch (e1) {}

        try {
            pushColor(it.strokeColor, seen, result);
        } catch (e2) {}
    }

    function collectFromTextFast(tf, seen, result) {
        try {
            pushColor(tf.textRange.characterAttributes.fillColor, seen, result);
        } catch (e1) {}

        try {
            pushColor(tf.textRange.characterAttributes.strokeColor, seen, result);
        } catch (e2) {}

        if (!CFG.fastTextScan) {
            try {
                var chars = tf.textRange.characters;

                for (var i = 0; i < chars.length; i++) {
                    try {
                        pushColor(chars[i].characterAttributes.fillColor, seen, result);
                    } catch (e3) {}

                    try {
                        pushColor(chars[i].characterAttributes.strokeColor, seen, result);
                    } catch (e4) {}
                }
            } catch (e5) {}
        }
    }

    function pushColor(c, seen, result) {
        if (!c) return;

        try {
            if (c.typename === "SpotColor") {
                pushSpot(c.spot, seen, result);
            }
            else if (c.typename === "GradientColor") {
                var stops = c.gradient.gradientStops;

                for (var i = 0; i < stops.length; i++) {
                    pushColor(stops[i].color, seen, result);
                }
            }
        } catch (e) {}
    }

    function pushSpot(spot, seen, result) {
        if (!spot) return;

        var name = spot.name;

        if (!seen[name]) {
            seen[name] = true;
            result.push(spot);
        }
    }

    // =========================================================
    // UI SWATCH COLOR
    // =========================================================

    function spotToRGB01(spot) {
        try {
            var c = spot.color;

            if (c.typename === "RGBColor") {
                return [
                    c.red / 255,
                    c.green / 255,
                    c.blue / 255
                ];
            }

            if (c.typename === "CMYKColor") {
                var C = c.cyan / 100;
                var M = c.magenta / 100;
                var Y = c.yellow / 100;
                var K = c.black / 100;

                return [
                    (1 - C) * (1 - K),
                    (1 - M) * (1 - K),
                    (1 - Y) * (1 - K)
                ];
            }
        } catch (e) {}

        return [0.4, 0.4, 0.4];
    }

    // =========================================================
    // DASHBOARD
    // =========================================================

    function showDashboard(spots) {
        var dlg = new Window("dialog", "Spot Color Key Ordering");
        dlg.orientation = "column";
        dlg.alignChildren = ["fill", "top"];
        dlg.margins = [18, 18, 18, 18];
        dlg.spacing = 10;

        var header = dlg.add("group");
        header.orientation = "row";
        header.spacing = 8;

        addHeader(header, "swatch", 60);
        addHeader(header, "order", 60);
        addHeader(header, "name", 240);

        var panel = dlg.add("panel", undefined, "");
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.margins = [8, 8, 8, 8];
        panel.spacing = 7;

        var rows = [];

        for (var i = 0; i < spots.length; i++) {
            var row = panel.add("group");
            row.orientation = "row";
            row.alignChildren = ["left", "center"];
            row.spacing = 8;

            var sw = row.add("statictext", [0, 0, 52, 28], "");
            drawUISwatch(sw, spots[i]);

            var orderEt = row.add("edittext", [0, 0, 60, 24], String(i + 1));
            orderEt.justify = "center";

            var nameEt = row.add("edittext", [0, 0, 240, 24], spots[i].name);

            rows.push({
                spot: spots[i],
                orderEt: orderEt,
                nameEt: nameEt
            });
        }

        var optPanel = dlg.add("panel", undefined, "options");
        optPanel.orientation = "column";
        optPanel.alignChildren = ["fill", "top"];
        optPanel.margins = [10, 14, 10, 10];
        optPanel.spacing = 8;

        var optRow1 = optPanel.add("group");
        optRow1.orientation = "row";
        optRow1.alignment = "center";
        optRow1.spacing = 30;

        var cbAlign = optRow1.add("checkbox", undefined, "stack all text on same center");
        cbAlign.value = CFG.alignDefault;

        var cbOP = optRow1.add("checkbox", undefined, "overprint");
        cbOP.value = CFG.overprintDefault;

        var optRow2 = optPanel.add("group");
        optRow2.orientation = "row";
        optRow2.alignChildren = ["left", "center"];
        optRow2.spacing = 8;

        optRow2.add("statictext", undefined, "final group position:");

        var ddPos = optRow2.add("dropdownlist", undefined, [
            "bottom left",
            "bottom right"
        ]);
        ddPos.selection = 0;

        var btnRow = dlg.add("group");
        btnRow.alignment = "center";
        btnRow.spacing = 14;

        var btnCreate = btnRow.add("button", undefined, "create", { name: "ok" });
        var btnCancel = btnRow.add("button", undefined, "cancel", { name: "cancel" });

        btnCancel.onClick = function () {
            dlg.close();
        };

        btnCreate.onClick = function () {
            var entries = [];

            for (var r = 0; r < rows.length; r++) {
                var ord = parseInt(rows[r].orderEt.text, 10);

                if (isNaN(ord) || ord < 1) {
                    alert("Invalid order in row " + (r + 1));
                    return;
                }

                entries.push({
                    spot: rows[r].spot,
                    order: ord,
                    name: rows[r].nameEt.text || rows[r].spot.name
                });
            }

            entries.sort(function (a, b) {
                return a.order - b.order;
            });

            var finalPosition = ddPos.selection.index === 1 ? "right" : "left";

            dlg.close();

            createTextGroup(entries, cbAlign.value, cbOP.value, finalPosition);
        };

        dlg.center();
        dlg.show();
    }

    function addHeader(parent, txt, w) {
        var s = parent.add("statictext", [0, 0, w, 20], txt);
        s.justify = "center";
        return s;
    }

    function drawUISwatch(el, spot) {
        var rgb = spotToRGB01(spot);

        el.onDraw = function () {
            var g = this.graphics;
            var W = this.size[0];
            var H = this.size[1];

            var fill = g.newBrush(
                g.BrushType.SOLID_COLOR,
                [rgb[0], rgb[1], rgb[2], 1]
            );

            var pen = g.newPen(
                g.PenType.SOLID_COLOR,
                [0, 0, 0, 1],
                1
            );

            g.newPath();
            g.rectPath(0, 0, W, H);
            g.fillPath(fill);

            g.newPath();
            g.rectPath(0.5, 0.5, W - 1, H - 1);
            g.strokePath(pen);
        };
    }

    // =========================================================
    // CREATE FINAL GROUP
    // =========================================================

    function createTextGroup(entries, doAlign, doOverprint, finalPosition) {
        var ref = getReferenceCenter();

        var layer = getOrCreateLayer(CFG.layerName);
        layer.locked = false;
        layer.visible = true;

        if (CFG.clearOldOutput) {
            clearLayerFast(layer);
        }

        var group = layer.groupItems.add();
        group.name = "Spot Color Key Text Group";

        var ab = getActiveAB();

        var lineStep = CFG.fontSize + CFG.lineGap;

        var anchorX = doAlign ? ref.x : ab[0] + CFG.offsetFromArtboardLeft;
        var anchorY = doAlign ? ref.y : ab[1] - CFG.offsetFromArtboardTop;

        var baselineOffset = CFG.fontSize * CFG.baselineOffsetFactor;

        for (var i = 0; i < entries.length; i++) {
            var e = entries[i];

            var spotColor = makeSpotColor(e.spot, 100);

            var num = CFG.useArabicDigitsInOutput
                ? toArabicDigits(String(e.order))
                : String(e.order);

            var txt = num + " - " + e.name;

            var tf = group.textFrames.add();
            tf.kind = TextType.POINTTEXT;
            tf.contents = txt;

            tf.name = "Color Key - " + e.order + " - " + e.name;

            applyTextStyle(tf, spotColor, doOverprint);

            if (doAlign) {
                // Fast stacked center. No per-text bounds.
                tf.position = [
                    anchorX,
                    anchorY + baselineOffset
                ];
            } else {
                // Normal vertical list.
                tf.position = [
                    anchorX,
                    anchorY - (i * lineStep)
                ];
            }
        }

        // One bounds calculation only for the final group.
        moveGroupToBottom(group, finalPosition);

        try {
            DOC.selection = null;
            group.selected = true;
        } catch (eSel) {}

        app.redraw();

        alert("Done. Final result grouped and placed at bottom " + finalPosition + ".");
    }

    // =========================================================
    // MOVE GROUP TO BOTTOM LEFT / RIGHT
    // =========================================================

    function moveGroupToBottom(group, finalPosition) {
        var ab = getActiveAB();

        try {
            var b = group.visibleBounds;
            var groupLeft = b[0];
            var groupTop = b[1];
            var groupRight = b[2];
            var groupBottom = b[3];

            var targetLeft;

            if (finalPosition === "right") {
                targetLeft = ab[2] - CFG.sideMargin - (groupRight - groupLeft);
            } else {
                targetLeft = ab[0] + CFG.sideMargin;
            }

            var targetBottom = ab[3] + CFG.bottomMargin;

            var dx = targetLeft - groupLeft;
            var dy = targetBottom - groupBottom;

            group.translate(dx, dy);
            return;
        } catch (e1) {}

        try {
            var gb = group.geometricBounds;
            var gLeft = gb[0];
            var gRight = gb[2];
            var gBottom = gb[3];

            var tLeft;

            if (finalPosition === "right") {
                tLeft = ab[2] - CFG.sideMargin - (gRight - gLeft);
            } else {
                tLeft = ab[0] + CFG.sideMargin;
            }

            var tBottom = ab[3] + CFG.bottomMargin;

            group.translate(tLeft - gLeft, tBottom - gBottom);
        } catch (e2) {}
    }

    // =========================================================
    // TEXT STYLE
    // =========================================================

    function applyTextStyle(tf, fillColor, doOverprint) {
        try {
            tf.textRange.characterAttributes.size = CFG.fontSize;
        } catch (e1) {}

        try {
            tf.textRange.characterAttributes.fillColor = fillColor;
        } catch (e2) {}

        try {
            tf.textRange.characterAttributes.strokeColor = new NoColor();
        } catch (e3) {}

        try {
            tf.textRange.characterAttributes.strokeWeight = 0;
        } catch (e4) {}

        try {
            tf.textRange.characterAttributes.overprintFill = !!doOverprint;
        } catch (e5) {}

        try {
            tf.textRange.paragraphAttributes.justification = Justification.CENTER;
        } catch (e6) {}
    }

    // =========================================================
    // HELPERS
    // =========================================================

    function makeSpotColor(spot, tint) {
        var c = new SpotColor();
        c.spot = spot;
        c.tint = tint;
        return c;
    }

    function getOrCreateLayer(name) {
        try {
            return DOC.layers.getByName(name);
        } catch (e) {
            var l = DOC.layers.add();
            l.name = name;
            return l;
        }
    }

    function clearLayerFast(layer) {
        try {
            layer.locked = false;
            layer.visible = true;
        } catch (e0) {}

        try {
            for (var i = layer.pageItems.length - 1; i >= 0; i--) {
                try {
                    layer.pageItems[i].remove();
                } catch (e1) {}
            }
        } catch (e2) {}
    }

    function toArabicDigits(s) {
        var western = "0123456789";
        var arabic = "٠١٢٣٤٥٦٧٨٩";
        var out = "";

        for (var i = 0; i < s.length; i++) {
            var idx = western.indexOf(s.charAt(i));
            out += idx >= 0 ? arabic.charAt(idx) : s.charAt(i);
        }

        return out;
    }

    // =========================================================
    // RUN
    // =========================================================

    var spots = collectUsedSpots();

    if (!spots.length) {
        alert("No used Spot Colors found on the active artboard.");
        return;
    }

    showDashboard(spots);

})();
