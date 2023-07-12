const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function run() {
  try {
    // Get the pull request information
    const { data: pullRequest } = await octokit.pulls.get({
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY,
      pull_number: process.env.GITHUB_REF.split("/").pop(),
    });

    // Get the diff for the pull request
    const { data: diff } = await octokit.pulls.get({
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY,
      pull_number: process.env.GITHUB_REF.split("/").pop(),
      mediaType: {
        format: "diff",
      },
    });

    // Extract the added lines from the diff
    const addedLines = diff.split("\n").filter((line) => line.startsWith("+"));

    // Generate the summary message
    let summaryMessage = "Changes in this pull request:\n\n";
    addedLines.forEach((line) => {
      // Remove the '+' character from the line
      const formattedLine = line.slice(1).trim();
      summaryMessage += `- ${formattedLine}\n`;
    });

    // Post the summary as a comment on the pull request
    await octokit.issues.createComment({
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY,
      issue_number: pullRequest.number,
      body: summaryMessage,
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
