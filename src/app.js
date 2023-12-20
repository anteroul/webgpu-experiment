const canvas = document.querySelector("canvas");
const context = canvas.getContext("webgpu");
const adapter = await navigator.gpu.requestAdapter();
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
const device = await adapter.requestDevice();
const shader = await loadShader("../shaders/shader2D.wgsl");
const vertices = new Float32Array([1, 1, 1]);

function init() {
    if (!navigator.gpu) {
        throw new Error("WebGPU not supported on this browser.");
    } else {
        console.log("WebGPU support confirmed.");
    }

    if (!adapter) {
        throw new Error("No appropriate GPUAdapter found!");
    }

    context.configure({
        device: device,
        format: canvasFormat
    });
}

async function loadShader(url) {
    const response = await fetch(url);
    const source = await response.text();
    const shaderModule = device.createShaderModule({ code: source });
    return shaderModule;
}

const vertexBuffer = device.createBuffer({
    label: "Vertices",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});

const vertexBufferLayout = {
    arrayStride: 0,
    attributes: [{
        format: "float32x2",
        offset: 0,
        shaderLocation: 0,
    }],
};

const pipeline = device.createRenderPipeline({
    label: "Pipeline",
    layout: "auto",
    vertex: {
        module: shader,
        entryPoint: "vs_main",
        buffers: [vertexBufferLayout]
    },
    fragment: {
        module: shader,
        entryPoint: "fs_main",
        targets: [{
            format: canvasFormat
        }]
    },
    primitive: {
        topology: "triangle-list",
    }
});

function render() {
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const encoder = device.createCommandEncoder();

    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
            storeOp: "store",
        }]
    });

    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(vertices.length);
    pass.end();

    device.queue.submit([encoder.finish()]);
    requestAnimationFrame(render);
}

init();
render();
