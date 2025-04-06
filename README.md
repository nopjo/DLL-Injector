<a name="readme-top"></a>

<div align="center">
  <a href="https://github.com/nopjo/DLL-Injector">
    <img src="https://github.com/user-attachments/assets/d86f618c-216f-4ab0-8699-03d6b0ee403c" alt="Logo" width="140" height="140">
  </a>
  <h3 align="center">DLL Injector</h3>

  <p align="center">
    A simple DLL Injector built with Rust and React using Tauri
  </p>
</div>

<div align="center">
  <video src="https://github.com/user-attachments/assets/e8e0b526-7b47-4665-bbf2-1db5fca949e1" alt="Showcase video">
</div>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Building from Source](#building-from-source)
  - [Prerequisites](#prerequisites)
  - [Steps](#steps)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Process Selection Tips](#process-selection-tips)
  - [Architecture Compatibility](#architecture-compatibility)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Features

- Modern UI: Built with React and styled with Tailwind CSS

- Multiple Injection Methods: Supports both LoadLibrary and Manual Mapping techniques
 
- Advanced Process Selection:
  - Search processes by name or PID
  - Group identical processes for better organization
  - Direct process termination capabilities
  - Highlighting of search matches

- Real-time Monitoring: Continuously checks if the target process is running

- Process-Specific Injection: Target specific instances of processes with identical names

<br />

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

1. Navigate to the [Releases](https://github.com/nopjo/dll-injector/releases) tab
2. Download the appropriate version for your operating system or your target executable version (32 bit or 64 bit)
3. Run the installer if you aren't using the portable version
4. Launch the application and you're ready to go! 🚀

> [!IMPORTANT]  
> Make sure to download the version that matches your system architecture. The 64-bit injector can only inject 64-bit DLLs into 64-bit processes, and the 32-bit injector can only inject 32-bit DLLs into 32-bit processes. Cross-architecture injection is planned for a future release.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Building from Source

Tested on Windows (32 bit and 64 bit) both latest versions of Windows 11 and 10.

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Node.js](https://nodejs.org/en/download) (v16 or later)
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) with C++ desktop development workload

<br />

### Steps
1. Clone the repository:
```
git clone https://github.com/nopjo/dll-injector.git
cd dll-injector
```

2. Install dependencies (use any package manager you want yarn, pnpm or npm):
```
npm install
```

3. Test if you can run dev:
```
npm run tauri dev
```

4. Build the application (64 bit):
```
npm run tauri build --target i686-pc-windows-msvc
```

5. Building the 32 bit version:
> [!NOTE]  
> You need to install the 32-bit Rust target first using rustup if not installed.
```
rustup target add i686-pc-windows-msvc
```

Then run 
```
npm run tauri build --target i686-pc-windows-msvc
```

6. The built applications will be available in `src-tauri/target/`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Basic Usage
1. Launch the application
2. Select a target process:
    - Click the list icon next to "Target Process"
    - Use the search bar to find your process
    - Select a specific process instance
3. Select a DLL:
    - Click the file icon to browse for a DLL
    - Or select one from the history panel if available
4. Inject the DLL:
    - Wait for the target process to show as `RUNNING`
    - Click the `INJECT` button

### Process Selection Tips
- **Searching**: Type a process name or PID in the search bar to filter the list
- **Grouped Processes**: For applications with multiple instances:
  - Click the group header to expand/collapse
  - Select a specific instance by its PID
- **Expand/Collapse All**: Use the buttons at the bottom to expand or collapse all groups
- **Process Termination**: Click the skull icon to kill a process

### Architecture Compatibility
This application follows standard DLL injection rules regarding architecture compatibility:

- **64-bit injector**: Can only inject 64-bit DLLs into 64-bit processes
- **32-bit injector**: Can only inject 32-bit DLLs into 32-bit processes

> [!NOTE]  
> Cross-architecture injection is planned for future development. See the Roadmap section for more details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap
- Cross-architecture injection support (32-bit ↔ 64-bit)
- Process filtering options (by architecture, window name etc.)
- Advanced stealth techniques
- Kernel mode injection support
- Additional injection methods (thread hijacking, etc.)
- Custom DLL initialization parameters
- Plugin system for custom injection methods
- Hotkey support for quick injection
- Auto-injection when target process launches
- Improved UI/UX options and themes

## License

Distributed under the MIT License. See `LICENSE` for more information.
