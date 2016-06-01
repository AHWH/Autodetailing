# Auto-Detailing

A javascript-based detailing system that allows the planner to with a click of a button, automatically generates a schedule for the day based on the personnel selected.

## Background

Planning duties have always been a chore and boring thing to do. It requires the planner to divide the timing equally, allocate the personnel and deal with people who might find it bias (as the planner might not be truly random). Hence to get around problem, the idea of an automatic generated detailing by the computer was hatched. However it has some criteria.

* It cannot be executables
* No cross-site scripting can be done
* It has to be able to divide the timing equally among duties
* It has to assign the correct personnel to do the appropriate duties

Hence a browser-based system was chosen and Javascript was the language of choice for the behind-the-scenes work.

## Credits where it is due

This auto-detailing system didn't originate from me. It was the brainchild of my seniors as they saw the problem and wished to simplify their job.
However, with changes in practices, duties and operating environment of the computer. The auto-detailing system became outdated as it is unable to plan for new type of duties. Eventually, it fails to run on the updated operating environment of the desktop.

## What I have done

Well, this is a stepping stone for me into programming. I took up the task to rebuilt this auto-detailing and use it as my practise for my Javascript. Eventually, I understand the process of how it works and recode it.

* Switched to Bootstrap 3 for the styling
* Added ability to plan for Friday timing where duties are shorter
* Added ability to plan for half-day and special event where duties timing are significantly different
* Added criteria for personnel duty timing for special event to prevent back to back duties
