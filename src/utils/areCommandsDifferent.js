const { ApplicationCommand } = require("discord.js");

/**
 * @param {ApplicationCommand} existingCommand
 * @param {ApplicationCommand} localCommand
 * */
module.exports = (existingCommand, localCommand) => {
	/**
	 * @param {{ name: string, value: string | number }[]} existingChoices
	 * @param {{ name: string, value: string | number }[]} localChoices
	 */
	const areChoicesDifferent = (existingChoices, localChoices) => {
		for (const localChoice of localChoices) {
			const existingChoice = existingChoices?.find(
				(choice) => choice.name === localChoice.name,
			);

			if (!existingChoice) {
				return true;
			}

			if (localChoice.value !== existingChoice.value) {
				return true;
			}
		}
		return false;
	};

	/**
	 * @param {{ name: string, description: string, type: number, required?: boolean, choices?: any[] }[]} existingOptions
	 * @param {{ name: string, description: string, type: number, required?: boolean, choices?: any[] }[]} localOptions
	 */
	const areOptionsDifferent = (existingOptions, localOptions) => {
		for (const localOption of localOptions) {
			const existingOption = existingOptions?.find(
				(option) => option.name === localOption.name,
			);

			if (!existingOption) {
				return true;
			}

			if (
				localOption.description !== existingOption.description ||
				localOption.type !== existingOption.type ||
				(localOption.required || false) !== existingOption.required ||
				(localOption.choices?.length || 0) !==
					(existingOption.choices?.length || 0) ||
				areChoicesDifferent(
					localOption.choices || [],
					existingOption.choices || [],
				)
			) {
				return true;
			}
		}
		return false;
	};

	if ((existingCommand.type ?? 1) !== (localCommand.type ?? 1)) {
		return true;
	}

	if (localCommand.type === undefined) {
		if (
			existingCommand.description !== localCommand.description ||
			existingCommand.options?.length !==
				(localCommand.options?.length || 0) ||
			areOptionsDifferent(
				existingCommand.options,
				localCommand.options || [],
			)
		) {
			return true;
		}
	}

	return false;
};
