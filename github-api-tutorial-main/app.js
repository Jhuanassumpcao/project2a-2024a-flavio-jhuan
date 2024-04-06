// Get the GitHub username input form
const gitHubForm = document.getElementById('gitHubForm');

const repoTemplate = {
    success: (r) => (`
        <p><strong>Repo:</strong> ${r.name}</p>
        <p><strong>Description:</strong> ${r.description}</p>
        <p><strong>URL:</strong> <a href="${r.html_url}">${r.html_url}</a></p>
    `),
    error: (err) => (`
        <p><strong>No account exists with username:</strong> ${err.username}</p>
    `)
}

const commitTemplate = {
    success: (c) => (`
        <p><strong>Commit:</strong> ${c.commit.message}</p>
        <p><strong>Author:</strong> ${c.commit.author.name}</p>
        <p><strong>Date:</strong> ${c.commit.author.date}</p>
    `),
    error: (err) => (`
        <p><strong>No repo or user exists</strong></p>
    `)
}

gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

    gitHubUserName = getUserName();
    gitHubUserRepo = getUserRepo();

    liTemplate = gitHubUserRepo ? commitTemplate : repoTemplate;

    (gitHubUserRepo ? requestUserCommits(gitHubUserName, gitHubUserRepo)
                    : requestUserRepos(gitHubUserName))
        .then(response => response.json())
        .then(data => updateUlElemets(data, liTemplate))
})

updateUlElemets = (data, liTemplate) => {
    let ul = document.getElementById('userResponse');
    ul.innerHTML = '';

    if (data.message === "Not Found") {
        let li = document.createElement('li');
        li.classList.add('list-group-item')
        li.innerHTML = liTemplate.error(data);
        ul.appendChild(li);
        return;
    }

    for (let i in data) {
        let li = document.createElement('li');
        li.classList.add('list-group-item')
            
        li.innerHTML = liTemplate.success(data[i]);
        
        ul.appendChild(li);
    }
}

getUserName = () => {
    let usernameInput = document.getElementById('usernameInput');
    let gitHubUserName = usernameInput.value;
    return gitHubUserName;
}

getUserRepo = () => {
    let userRepoInput = document.getElementById('userRepoInput');
    let gitHubRepo = userRepoInput.value;
    return gitHubRepo;
}

function requestUserRepos(username) {
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

function requestUserCommits(username, repo) {
    return Promise.resolve(fetch(`https://api.github.com/repos/${username}/${repo}/commits`));
}