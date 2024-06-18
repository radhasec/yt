function toggleDownloadOptions() {
    const downloadType = document.getElementById('downloadType').value;
    const audioOptions = document.getElementById('audioOptions');
    const resolutionGroup = document.getElementById('resolutionGroup');
    const formatGroup = document.getElementById('formatGroup');

    if (downloadType === 'audio') {
        audioOptions.style.display = 'block';
        resolutionGroup.classList.add('hidden');
        formatGroup.classList.add('hidden');
    } else {
        audioOptions.style.display = 'none';
        resolutionGroup.classList.remove('hidden');
        formatGroup.classList.remove('hidden');
    }
}

function toggleTrimOptions() {
    const trimOptions = document.getElementById('trimOptions');
    trimOptions.classList.toggle('hidden');
}

function toggleThumbnailOptions() {
    const thumbnailOptions = document.getElementById('thumbnailOptions');
    thumbnailOptions.classList.toggle('hidden');
}

function generateCommands() {
    const videoUrl = document.getElementById('videoUrl').value;
    const outputName = document.getElementById('outputName').value;
    const downloadType = document.getElementById('downloadType').value;
    const trimAudio = document.getElementById('trimAudio').checked;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const customThumbnail = document.getElementById('customThumbnail').checked;
    const imageUrl = document.getElementById('imageUrl').value;
    const resolution = document.getElementById('resolution').value;
    const format = document.getElementById('format').value;

    let ytDlpCommand = `yt-dlp`;
    let commands = '';

    if (downloadType === 'audio') {
        ytDlpCommand += ` -x --audio-format mp3`;

        if (trimAudio) {
            ytDlpCommand += ` --postprocessor-args "-ss ${startTime} -to ${endTime}"`;
        }

        if (customThumbnail) {
            const ffmpegCommand = `ffmpeg -i "${outputName}.mp3" -i "${imageUrl}" -map 0:a -map 1:v -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" "${outputName}_with_thumbnail.mp3"`;
            commands += `\n\n${ffmpegCommand}`;
        } else {
            ytDlpCommand += ` --embed-thumbnail`;
        }

        ytDlpCommand += ` ${videoUrl} -o "${outputName}.mp3"`;
        commands = ytDlpCommand;
    } else if (downloadType === 'video' || downloadType === 'playlist') {
        let resolutionOption = '';
        if (resolution !== 'best') {
            resolutionOption = `bestvideo[height<=${resolution.replace('p', '')}]+bestaudio/best[height<=${resolution.replace('p', '')}]`;
        } else {
            resolutionOption = 'bestvideo+bestaudio/best';
        }

        ytDlpCommand += ` -f "${resolutionOption}" --merge-output-format ${format} ${videoUrl} -o "${outputName}.%(ext)s"`;

        if (downloadType === 'playlist') {
            ytDlpCommand += ` --yes-playlist`;
        }

        commands = ytDlpCommand;
    }

    document.getElementById('commands').textContent = commands;
}

function copyToClipboard() {
    const commands = document.getElementById('commands').textContent;
    navigator.clipboard.writeText(commands).then(() => {
        alert('Commands copied to clipboard');
    }).catch(err => {
        alert('Failed to copy commands');
    });
}

