export class TriangleMesh {
    TriangleMesh(device) {
        buffer;
        bufferLayout;

        const vertices = new Float32Array(
            [
                0.0,  0.0,  0.5, 1.0, 0.0, 0.0,
                0.0, -0.5, -0.5, 0.0, 1.0, 0.0,
                0.0,  0.5, -0.5, 0.0, 0.0, 1.0
            ]
        );

        const usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

        const descriptor = {
            size: vertices.byteLength,
            usage: usage,
            mappedAtCreation: true
        };

        this.buffer = device.createBuffer(descriptor);

        //Buffer has been created, now load in the vertices
        new Float32Array(this.buffer.getMappedRange()).set(vertices);
        this.buffer.unmap();

        //now define the buffer layout
        this.bufferLayout = {
            arrayStride: 24,
            attributes: [
                {
                    shaderLocation: 0,
                    format: "float32x3",
                    offset: 0
                },
                {
                    shaderLocation: 1,
                    format: "float32x3",
                    offset: 12
                }
            ]
        }
    }
}