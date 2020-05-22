class Theme {
    constructor(
        path,
        name,
        cpuColor,
        cpuSpecColor,
        cpuHoverColor,
        fpgaColor,
        fpgaSpecColor,
        fpgaHoverColor,
        backgroundColor
    ) {
        this.cpuColor = cpuColor;
        this.cpuSpecColor = cpuSpecColor;
        this.cpuHoverColor = cpuHoverColor;
        this.fpgaColor = fpgaColor;
        this.fpgaSpecColor = fpgaSpecColor;
        this.fpgaHoverColor = fpgaHoverColor;
        this.backgroundColor = backgroundColor;
        this.background = `${path}/${name}/background.jpg`;
        this.needle = `${path}/${name}/needle.svg`;
        this.cpu = `${path}/${name}/cpu`;
        this.fpga = `${path}/${name}/fpga`;
        this.startCPU = `${path}/${name}/start cpu.svg`;
        this.stopCPU = `${path}/${name}/stop cpu.svg`;
        this.startFPGA = `${path}/${name}/start fpga.svg`;
        this.stopFPGA = `${path}/${name}/stop fpga.svg`;
    }
}

export default Theme;