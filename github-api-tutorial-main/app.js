const gitHubForm = document.getElementById('gitHubForm');

const templateDictionary = {
    'repo': (r) => (`
        <p><strong>Repo:</strong> ${r.name}</p> 
        <p><strong>Description:</strong> ${r.description}</p>
        <p><strong>URL:</strong> <a href="${r.html_url}">${r.html_url}</a></p>
    `),
    'commit': (c) => (`
        <p><strong>Commit:</strong> ${c.commit.message}</p>
        <p><strong>Author:</strong> ${c.commit.author.name}</p>
        <p><strong>Date:</strong> ${c.commit.author.date}</p>
    `),
    'error': (err) => (`
        <p><strong>No account exists with username:</strong> ${err.username}</p>
    `)
};

gitHubForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    resetFieldHighlight('usernameInput');
    resetFieldHighlight('userRepoInput');

    const gitHubUserName = getUserName();
    const gitHubUserRepo = getUserRepo();

    if (!gitHubUserName) {
        alert('Please enter a GitHub username.');
        highlightField('usernameInput');
        return;
    }


    let liTemplate = templateDictionary[gitHubUserRepo ? 'commit' : 'repo'];

    try {
        const response = gitHubUserRepo ? await requestUserCommits(gitHubUserName, gitHubUserRepo)
                                         : await requestUserRepos(gitHubUserName);
        const data = await response.json();

        let ul = document.getElementById('userResponse');
        ul.innerHTML = '';

        for (let i in data) {
            let li = document.createElement('li');
            li.classList.add('list-group-item');

            if (data.message === "Not Found") {
                li.innerHTML = templateDictionary['error'](data[i]);
                alert('Please enter a repository that exists.');
                highlightField('userRepoInput');
            } else {
                li.innerHTML = liTemplate(data[i]);
            }
            ul.appendChild(li);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function getUserName() {
    let usernameInput = document.getElementById('usernameInput');
    let gitHubUserName = usernameInput.value.trim();
    return gitHubUserName;
}

function getUserRepo() {
    let userRepoInput = document.getElementById('userRepoInput');
    let gitHubRepo = userRepoInput.value.trim();
    return gitHubRepo;
}

function highlightField(fieldId) {
    let field = document.getElementById(fieldId);
    field.style.border = '1px solid red';
}

function resetFieldHighlight(fieldId) {
    let field = document.getElementById(fieldId);
    field.style.border = '';
}

function requestUserRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos`);
}

function requestUserCommits(username, repo) {
    return fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
}
