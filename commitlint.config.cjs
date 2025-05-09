module.exports = {
	parserPreset: {
		parserOpts: {
			headerPattern:
				/^(🎨|⚡️|🔥|🐛|✨|📝|🚀|💄|🎉|✅|🔒|🔖|🚨|🚧|💚|⬇️|⬆️|📌|👷|📈|♻️|➕|➖|🔧|🔨|🌐|✏️|💩|⏪|🔀|📦|👽|🚚|📄|💥|🍱|♿️|💡|🔊|🔇|👥|🚸|🏗️|📱|🤡|🥚|🙈|🍻|💬|🗃️|🔊|🔍|🏷️|🌱|🚩|🥅|💫|🗑️|🛂|🩹|🧐|⚰️|🧪|👔|🩺|🧱|🧑‍💻|🚅|🦺)\s([a-z]+):\s(.+)$/u,
			headerCorrespondence: ['emoji', 'type', 'subject'],
		},
	},
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat',
				'fix',
				'docs',
				'style',
				'refactor',
				'perf',
				'test',
				'chore',
				'revert',
				'build',
				'ci',
				'deps',
				'dx',
				'ui',
				'config',
				'init',
				'security',
				'i18n',
				'a11y',
				'seo',
				'types',
				'db',
				'api',
				'auth',
				'lint',
			],
		],
		'subject-empty': [2, 'never'],
		'type-case': [2, 'always', 'lower-case'],
	},
};
