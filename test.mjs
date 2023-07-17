import { execSync } from 'child_process';

/** get an array of files that have changed between current branch and target branch */
export function getChangedFiles(targetBranch) {
  let currentBranch =
    process.env.CIRCLE_BRANCH ||
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

    console.log('current', currentBranch);
  let diff =
    currentBranch === targetBranch
      ? `HEAD..HEAD~1` // if this is the targetBranch, compare previous commit to this
      : `${currentBranch}..${targetBranch}`; // otherwise compare latest-to-latest

  return execSync(`git --no-pager diff --minimal --name-only ${diff}`)
    .toString()
    .split('\n')
    .map((ln) => ln.trim())
    .filter((ln) => !!ln);
}

getChangedFiles('main'); 