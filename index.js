const url = 'https://dummyjson.com/posts/';
const postsContainer = document.querySelector('.posts');
const loadMoreButton = document.querySelector('.loadPosts-btn');

const createNode = (element) => {
    return document.createElement(element);
};

let visiblePosts = 3;
let allPosts = [];

const showPosts = () => {
    postsContainer.innerHTML = '';

    const postsToShow = allPosts.slice(0, visiblePosts);
    postsToShow.forEach((post) => {
        const postBlock = createNode('article');
        postBlock.classList.add('post__block');

        const tags = post.tags;
        const tagsWithSharp = tags.map((tag) => `#${tag}`).join(' ');

        postBlock.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <div class="feedback__container">
                <p>${tagsWithSharp}</p>
                <p>reactions: ${post.reactions}</p>
            </div>
        `;

        postsContainer.appendChild(postBlock);
    });

    if (visiblePosts >= allPosts.length || visiblePosts >= 15) {
        loadMoreButton.style.display = 'none';
    }
};

const loadMorePosts = () => {
    visiblePosts += 3;
    showPosts();
};

loadMoreButton.addEventListener('click', loadMorePosts);

const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            visiblePosts += 3;
            showPosts();
        }
    });
};

const observerOptions = {
    root: null,
    rootMargin: '0px 0px 75px 0px',
    threshold: 1,
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
        allPosts = data.posts.slice(0, 15);
        showPosts();
        observer.observe(loadMoreButton);
    })
    .catch(function(error) {
        console.log(error);
    });