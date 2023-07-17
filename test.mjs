import { execSync } from 'child_process';
import parse from 'parse-diff';

/** get an array of files that have changed between current branch and target branch */
export function getChangedFiles(targetBranch) {
  let currentBranch =
    process.env.CIRCLE_BRANCH ||
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

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

async function go() {
  const diff = execSync('git diff main').toString()
  const tokens = listDesignTokenChanges(diff)
}

async function listDesignTokenChanges(diffContent) {
  try {
    const parsed = parse(diffContent)
    const docsFile = parsed.find(file => file.to.includes('base.reference.json'))
    console.log('docs',docsFile);

    let out = []

    for (let chunk of docsFile.chunks) {
      let change = parseTokenChanges(chunk.changes)
      out.push(change)

    }
    return out
  } catch (error) {
    console.error('Error:', error);
  }
}


function parseTokenChanges(input) {
  let name;
  let oldValue;
  let newValue;
  let typeOfChange;


}

function oldparseTokenChanges(input) {
  let name;
  let oldValue;
  let newValue;
  let typeOfChange;
  console.log(input);

  for (const item of input) {
    if (item.type === 'del' && item.content.includes('name')) {
      // Deleted line - extract old value
      console.log('heard name remove')
      const testline = input.find((line) => line.content.includes('name'));
      var testname = testline.content.split(':')[1].trim().replace(/["',]/g, '');
      typeOfChange = 'Removed'
      name = testname
    }

    else if (item.type === 'del' && item.content.includes('value')) {
      // Deleted line - extract old value
      oldValue = item.content.split(':')[1].trim().replace(/["',]/g, '');
      typeOfChange = 'Edit'
    } else if (item.type === 'add' && item.content.includes('value')) {
      typeOfChange = 'Edit'
      // Added line - extract new value
      newValue = item.content.split(':')[1].trim().replace(/["',]/g, '');

      const nameLine = input.find((line) => line.content.includes('name'));
      name = nameLine.content.split(':')[1].trim().replace(/["',]/g, '');
    }
  }

  const token = { name, old: oldValue, new: newValue, type: typeOfChange };
  return token;
}


// getChangedFiles('main'); 
go()